import { User } from '../models/User';
import { Claim } from '../models/Claim';
import { Document } from '../models/Document';
import mongoose from 'mongoose';

export class MongoDBService {
  // User operations
  static async createUser(userData: any) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      throw error;
    }
  }

  static async getUserById(id: string) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  static async getUserByEmail(email: string) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }

  // Claim operations
  static async createClaim(claimData: any) {
    try {
      const claim = new Claim(claimData);
      return await claim.save();
    } catch (error) {
      throw error;
    }
  }

  static async getClaimById(id: string) {
    try {
      return await Claim.findById(id)
        .populate('userId', 'name email')
        .populate('documents');
    } catch (error) {
      throw error;
    }
  }

  static async getClaimsByUserId(userId: string) {
    try {
      return await Claim.find({ userId })
        .populate('documents')
        .sort({ created_at: -1 });
    } catch (error) {
      throw error;
    }
  }

  static async updateClaimStatus(id: string, status: string, approvedBy?: string) {
    try {
      const updates: any = {
        status,
        updated_at: new Date(),
      };

      if (status === 'approved') {
        updates.approved_at = new Date();
        updates.approved_by = approvedBy;
      }

      return await Claim.findByIdAndUpdate(id, updates, { new: true });
    } catch (error) {
      throw error;
    }
  }

  // Document operations
  static async createDocument(documentData: any) {
    try {
      const document = new Document(documentData);
      const savedDoc = await document.save();

      // Update the associated claim with the new document
      await Claim.findByIdAndUpdate(
        documentData.claimId,
        { $push: { documents: savedDoc._id } }
      );

      return savedDoc;
    } catch (error) {
      throw error;
    }
  }

  static async getDocumentById(id: string) {
    try {
      return await Document.findById(id)
        .populate('uploadedBy', 'name email')
        .populate('verifiedBy', 'name email');
    } catch (error) {
      throw error;
    }
  }

  static async updateDocumentVerification(id: string, status: string, verifiedBy: string) {
    try {
      return await Document.findByIdAndUpdate(
        id,
        {
          verificationStatus: status,
          verifiedBy,
          verifiedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      throw error;
    }
  }

  // Analytics operations
  static async getClaimStatistics() {
    try {
      return await Claim.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);
    } catch (error) {
      throw error;
    }
  }

  static async getClaimsByState() {
    try {
      return await Claim.aggregate([
        {
          $group: {
            _id: '$state',
            count: { $sum: 1 },
            approvedClaims: {
              $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
            },
            pendingClaims: {
              $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
            }
          }
        }
      ]);
    } catch (error) {
      throw error;
    }
  }
}