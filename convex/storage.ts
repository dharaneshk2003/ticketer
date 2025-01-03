import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Mutation to generate upload URL
export const generateUploadUrl = mutation(async (ctx) => {
  try {
    const uploadUrl = await ctx.storage.generateUploadUrl();
    if (!uploadUrl) {
      throw new Error("Failed to generate upload URL.");
    }
    return {
      success: true,
      uploadUrl,
    };
  } catch (error) {
    console.error("Error generating upload URL:", error.message);
    return {
      success: false,
      message: "Error generating upload URL.",
      error: error.message,
    };
  }
});

// Mutation to update event image
export const updateEventImage = mutation({
  args: {
    eventId: v.id("events"),
    storageId: v.union(v.id("_storage"), v.nullType()), // Allow null explicitly
  },
  handler: async (ctx, { eventId, storageId }) => {
    try {
      // Validate event existence
      const eventExists = await ctx.db.exists(eventId);
      if (!eventExists) {
        throw new Error(`Event with ID ${eventId} does not exist.`);
      }

      // Validate storageId in production
      if (storageId) {
        const storageExists = await ctx.storage.exists(storageId);
        if (!storageExists) {
          throw new Error(`Storage with ID ${storageId} does not exist.`);
        }
      }

      // Update image storage ID
      await ctx.db.patch(eventId, {
        imageStorageId: storageId ?? undefined,
      });

      // Fetch updated event
      const updatedEvent = await ctx.db.get(eventId);

      // Generate full image URL if storageId is provided
      const imageUrl = storageId
        ? await ctx.storage.getPublicUrl(storageId)
        : null;

      return {
        success: true,
        message: "Event image updated successfully.",
        event: {
          ...updatedEvent,
          imageUrl, // Include full image URL
        },
      };
    } catch (error) {
      console.error("Error updating event image:", error.message);
      return {
        success: false,
        message: "Failed to update event image.",
        error: error.message,
      };
    }
  },
});

export const getUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    return await ctx.storage.getUrl(storageId);
  },
});

export const deleteImage = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, { storageId }) => {
    await ctx.storage.delete(storageId);
  },
});
